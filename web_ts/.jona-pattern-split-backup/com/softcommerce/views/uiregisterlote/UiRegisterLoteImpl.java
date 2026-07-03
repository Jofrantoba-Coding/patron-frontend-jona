package com.softcommerce.views.uiregisterlote;

import com.softcommerce.beans.BeanLaboratorioClinico;
import com.softcommerce.beans.BeanUbicacion;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Lote;
import com.softcommerce.conta.tablas.TableModelLote;
import com.softcommerce.formularios.*;
import com.softcommerce.general.tablas.DocumentoVentaDetalleTableModel;
import com.softcommerce.general.tablas.IngresoDevolucionDespachadoTableModel;
import com.softcommerce.general.tablas.OrdenCompraDetalleTableModel;
import com.softcommerce.util.Constans;
import com.softcommerce.util.editor.CellEditorBtnLote;
import com.softcommerce.util.FrmPanel;
import com.softcommerce.util.Imagenes;
import com.softcommerce.util.Util;
import com.softcommerce.util.UtilDate;
import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Frame;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;

public class UiRegisterLoteImpl extends UiRegisterLote {

    public UiRegisterLoteImpl(Frame owner, String titulo, boolean value, ContaItem bean, OrdenCompraDetalleTableModel model, CellEditorBtnLote cellEditor, String idAlmacen) {
        super(owner, titulo, value, bean, model, cellEditor, idAlmacen);
    }

    public UiRegisterLoteImpl(Frame owner, String titulo, boolean value, ContaItem bean, IngresoDevolucionDespachadoTableModel model, CellEditorBtnLote cellEditor, String idAlmacen) {
        super(owner, titulo, value, bean, model, cellEditor, idAlmacen);
    }

    public UiRegisterLoteImpl(Frame owner, String titulo, boolean value, ContaItem bean, DocumentoVentaDetalleTableModel model, CellEditorBtnLote cellEditor, String idAlmacen) {
        super(owner, titulo, value, bean, model, cellEditor, idAlmacen);
    }
}
