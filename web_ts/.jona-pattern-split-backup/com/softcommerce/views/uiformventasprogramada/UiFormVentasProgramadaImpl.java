package com.softcommerce.views.uiformventasprogramada;

import com.softcommerce.beans.BeanVentaProgramada;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.TableModelVentaProgramada;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FEtxt;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Font;
import java.net.URL;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import org.apache.log4j.Logger;

public class UiFormVentasProgramadaImpl extends UiFormVentasProgramada {

    public UiFormVentasProgramadaImpl(Main frame, Usuario usuario, URL ruta, List<BeanVentaProgramada> listVtaProg) {
        super(frame, usuario, ruta, listVtaProg);
    }
}
