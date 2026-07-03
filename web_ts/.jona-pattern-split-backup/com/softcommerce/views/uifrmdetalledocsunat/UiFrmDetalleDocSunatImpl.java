package com.softcommerce.views.uifrmdetalledocsunat;

import com.google.gson.Gson;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.sunat.AnuladoQuery;
import com.softcommerce.beans.sunat.DocumentoGralQuery;
import com.softcommerce.beans.sunat.DocumentoQuery;
import com.softcommerce.beans.sunat.DocumentoVenta;
import com.softcommerce.beans.sunat.ResultSfs;
import com.softcommerce.beans.Usuario;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.formularios.*;
import com.softcommerce.formularios.Main;
import com.softcommerce.formularios.ReadProperties;
import com.softcommerce.formularios.sunat.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.sunat.ConvertDataSunat;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.LayoutUtil;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import org.apache.log4j.Logger;

public class UiFrmDetalleDocSunatImpl extends UiFrmDetalleDocSunat {

    public UiFrmDetalleDocSunatImpl(URL path, Main frm, Usuario usuario) {
        super(path, frm, usuario);
    }
}
